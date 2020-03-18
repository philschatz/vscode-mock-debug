#!/bin/bash

jar_filename="com.philschatz.xslt-1.0-SNAPSHOT-jar-with-dependencies.jar"

xslt_debug_root="../xslt-debug"
jar_path="${xslt_debug_root}/com.philschatz.xslt/target/${jar_filename}"

function die() {
	echo "*****" 1>&2
	echo "* $1" 1>&2
	exit 111
}

[[ -d "${xslt_debug_root}" ]] || die "Make sure you clone https://github.com/philschatz/xslt-debug to a directory next to this one"
[[ -f "${jar_path}" ]] || die "Make sure you run the build instructions in xslt-debug to generat "

cp "${jar_path}" ./server/