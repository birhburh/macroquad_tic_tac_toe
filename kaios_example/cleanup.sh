#!/bin/bash

set -e
# cat $1.js | sed 's/^OPTIMIZED: //' | sed 's/bundle.js:.*$//' | awk '{split($2,a,"_"); split(a[2],a,"("); print a[1]" "$0}' | sort -n | cut -d' ' -f2- >$1.new.js
# cat $1.js | sed 's/^OPTIMIZED: //' | sed 's/bundle.js:.*$//' | awk '{split($2,a,"_"); split(a[2],a,"("); print a[1]}' >$1.new.js
# mv $1.new.js $1.js
# exit
js-beautify <$1.js >$1.new.js
mv $1.new.js $1.js