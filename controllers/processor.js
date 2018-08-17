'use strict';
/**
 * Load Module Dependencies.
 */
const fs              = require('fs');
const crypto          = require('crypto');

const debug           = require('debug')('app:api-controller');
const moment          = require('moment');
const SpeechToTextV1  = require('watson-developer-cloud/speech-to-text/v1')
const google          = require('googleapis');
const wav             = require('wav');
const del             = require('del');

const CustomError     = require('../lib/errors').CustomError;
const config          = require('../config');

const speechToText = new SpeechToTextV1({
    username: config.WATSON.USERNAME,
    password: config.WATSON.PASSWORD,
    url: 'https://stream.watsonplatform.net/speech-to-text/api/'
});

/**
 * Calculate Exchange Rate
 *
 * @desc Get the Exchange Rate Between Currencies
 *
 * @param {Object} ctx Koa Instance Context
 * @param {Function} next Middleware dispatcher
 */
module.exports = (client) => {
  let transcriptStream = null;
  let wavWriter = null;
  let wavReader = null;
  let tempWavName = `${crypto.randomBytes(7).toString('hex')}.wav`;

  client.on('stream', onClientStream);

  client.on('close', onClientClose);

  function onWavWriterFinish() {
    debug('Transcribing with IBM Watson')

    transcriptStream  = fs.createWriteStream('./transcript.txt');
    wavReader         = fs.createReadStream(tempWavName);

    wavReader
      .pipe(speechToText.createRecognizeStream())
      .pipe(transcriptStream)
      .on('close', () =>{
        (async function() {
          await del([tempWavName]);
          client.send(transcriptStream);
        })();
      });

  }

  function onClientStream(stream, meta) {
    debug("Stream Start@" + meta.sampleRate +"Hz");


    wavWriter = new wav.FileWriter(tempWavName,{
      channels: 1,
      sampleRate: meta.sampleRate,
      bitDepth: 16
    });



    stream.pipe(wavWriter);

    wavWriter.on('finish', onWavWriterFinish);

  }

  function onClientClose() {
    debug("Stream Close");

    if(wavWriter != null) {
      wavWriter.end();
    }

  }


};


// Helpers
async function createAuriFolder(){
  // create folder to store notes if google drive
  var folderMetadata = {
    'name': 'Auri-Notes',
    'mimeType': 'application/vnd.google-apps.folder'
  };

  let auriFolder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id'
  });

  return auriFolder;
}

async function addNote(content, folder) {
  let today = moment();

  // create text file in google drive
  var fileMetadata = {
      'name': `${today.format('mm-dd-yyyy-hh-MM-period')}.txt`,
      parents: [folder.id]
  };
  var media = {
      mimeType: 'text/file',
      body: intoStream(Buffer.from(`${content}`))
  };

  let file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  });

  return file;
}

