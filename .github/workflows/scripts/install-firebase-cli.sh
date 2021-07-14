#!/bin/bash
# Use the below to use a specific branch of firebase-tools
# git clone --single-branch --branch jh-ext-emu-fixes https://github.com/firebase/firebase-tools.git
# cd firebase-tools
# npm i
# npm link --local
npm i -g firebase-tools@latest
firebase --open-sesame extdev
