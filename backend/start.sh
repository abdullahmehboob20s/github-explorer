#!/bin/bash
javac -encoding UTF-8 backend/*.java backend/handlers/*.java backend/store/*.java backend/utils/*.java
java backend.Main