#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodeStack } from '../lib/code-stack';

const app = new cdk.App();
new CodeStack(app, 'CodeStack');

app.synth();