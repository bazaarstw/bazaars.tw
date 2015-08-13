#!/bin/sh

lftp -u $FTP_USER,$FTP_PASSWORD -e "set ftp:ssl-allow no; set ssl:verify-certificate off; mirror -Rev -x .git -x #recycle . web_bazaars/. ; exit" ftp://$FTP_HOST/
