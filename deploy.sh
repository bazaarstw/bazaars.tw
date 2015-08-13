#!/bin/sh

echo $HOME
lftp -u $FTP_USER,$FTP_PASSWORD -e "set ssl:verify-certificate no; mirror -R -e . web_bazaars ; exit" ftp://$FTP_HOST/
