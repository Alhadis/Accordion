#!/usr/bin/perl
use strict;
use warnings;
use feature "say";
$/=undef;

my $input;
my $output;
while(<STDIN>){ $input = $_; }

my $template = $ARGV[0];
open(my $handle, "< $template");
while(<$handle>){
	s/(<body>\n).*?(\n[\x20\t]*?<div id="mindless-copy">)/$1\n$input$2/gmsi;
	$output = $_;
}

close($handle);
open($handle, "> $template");
print $handle $output;
