#!/usr/bin/env node
import { Command } from "commander";
import { createPollCommand } from "./commands/poll.command";

const program = new Command();

program
    .name('SABnzbd CLI Wrapper')
    .description('Simple SABnzbd API wrapper for the CLI')
    .version('1.0.0');

program.addCommand(createPollCommand());

program.parse();