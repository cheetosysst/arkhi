#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { argv } = require("process");

const templateDirectory = path.join(__dirname, "template");

function createSpinner(message) {
	const spinners = ["-", "\\", "|", "/"];
	let i = 0;

	const intervalId = setInterval(() => {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`[${spinners[i]}] ${message}`);

		i = (i + 1) % spinners.length;
	}, 100);

	return {
		stop: () => {
			clearInterval(intervalId);
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
		},
	};
}

async function main() {
	console.log("🏝️ Generateing Arkhi application boilerplate");
	const fse = require("fs-extra");

	if (argv.length < 3) {
		throw new Error("Please specify target directory.");
	}

	const targetDirectory = path.resolve(argv[2]);
	console.log(`[] Target directory: ${targetDirectory}`);
	fse.ensureDirSync(targetDirectory);

	const isEmpty = fs.readdirSync(targetDirectory).length === 0;
	if (!isEmpty) {
		throw new Error("targetDirectory is not empty");
	}

	const spinner = createSpinner("Copying tempaltes");
	const templateExists = fse.pathExistsSync(templateDirectory);
	if (!templateExists) {
		throw new Error(
			`Template directory '${templateDirectory}' does not exist.`
		);
	}

	fse.copySync(templateDirectory, targetDirectory);
	spinner.stop();

	console.log("❤️ Content initialized, have fun exploring!");
}

main().catch((e) => console.error(e));
