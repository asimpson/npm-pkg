'use strict';
const shell = require('child_process');
const aws = require('aws-sdk');
const fs = require('fs');

const s3 = new aws.S3({ region: 'us-east-1' });

exports.handler = (event, context, callback) => {
  process.env.HOME = '/tmp';
  const install = shell.spawnSync('npm', ['install', event.pkg, '--prefix=/tmp', '--progress=false']);
  if (install.stderr.length) {
    callback(`install error: ${install.stderr.toString()}`);
  } else {
    const tar = shell.spawnSync('tar', ['-cf', 'pkg.tar', 'node_modules'], {cwd: '/tmp'});
    if (tar.stderr.length) {
      callback(`tar error: ${tar.stderr.toString()}`);
    } else {
      const params = {
        Bucket: process.env.bucket,
        Body: fs.readFileSync('/tmp/pkg.tar'),
        Key: `${event.pkg}.tar`,
        ACL: 'public-read',
      };

      s3.putObject(params, (indexErr, uploadData) => {
        if (indexErr) {
          callback(`upload error: ${indexErr}`);
        }

        if (uploadData) {
          callback(null, JSON.stringify(`http://${process.env.bucket}.s3-website-us-east-1.amazonaws.com/${event.pkg}.tar`));
        }
      });
    }
  }
};
