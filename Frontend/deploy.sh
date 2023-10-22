#!/bin/bash

echo "Removing all files from /var/www/city-planner.budziszm.pl/html"
rm -Rf /var/www/city-planner.budziszm.pl/html/*

echo "Copying dist files to /var/www/city-planner.budziszm.pl/html/"
cp dist/frontend/* /var/www/city-planner.budziszm.pl/html/

echo "Frontend deployment done"
