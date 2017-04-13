#!/usr/bin/env bash
set -ex; 
 
build() { # ⭐ Gulp - run bulid tasks
    set -ex; 
    node --harmony `which gulp` build --gulpfile ./entrypoint.js
}

watch() { # ⌚ Gulp watch
    set -ex; 
    node --harmony `which gulp` watch:source --gulpfile ./entrypoint.js
}

# watch.livereload() {
#     set -ex; 
#     # out put what gulp livereload state 
#     # export DEBUG=*;
#     # --inspect --debug-brk allows for debugging node with chrome.
#     node --harmony `which gulp` watch:livereload --gulpfile ./entrypoint.js
# }

watch.livereload() {
    set -ex; 
    # out put what gulp livereload state 
    # export DEBUG=*;
    # --inspect --debug-brk allows for debugging node with chrome.
    export SZN_DEBUG=false
    node --harmony `which gulp` watch:livereload --gulpfile ./entrypoint.js
}

watch.livereload.chrome() {
    set -ex;
    # out put what gulp livereload state 
    # export DEBUG=*;
    #  --inspect=localhost:9229 --debug-brk allows for debugging node with chrome.
    export SZN_DEBUG=true
    export SZN_OPTION_BREAK=true
    node --harmony `which gulp` watch:livereload --gulpfile ./entrypoint.js
}

watch.livereload.chrome.noBreak() {
    set -ex;
    export SZN_DEBUG=true
    export SZN_OPTION_BREAK=false
    node --harmony `which gulp` watch:livereload --gulpfile ./entrypoint.js
}

development() {
    (cd /tmp/build/gulp_buildTool/; ./run.sh watch.livereload.chrome)
}

distribution() {
    export SZN_OPTION_ENTRYPOINT_NAME="entrypoint.development.js"
    export SZN_OPTION_ENTRYPOINT_PATH="/tmp/distribution/serverSide/"
    (cd /tmp/build/gulp_buildTool/; ./run.sh watch.livereload.chrome)
}

# Important: call arguments verbatim. i.e. allows first argument to call functions inside file. So that it could be called as "./setup/run.sh <functionName>".
$@
