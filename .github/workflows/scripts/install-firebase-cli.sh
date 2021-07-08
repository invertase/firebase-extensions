#!/bin/bash
# TODO switch to official release once fixes are published.
git clone --single-branch --branch jh-ext-emu-fixes https://github.com/firebase/firebase-tools.git
cd firebase-tools
npm i
npm link --local
firebase --open-sesame extdev
