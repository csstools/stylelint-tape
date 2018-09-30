export default name => {
	try {
		return require(name);
	} catch (error) {
		console.error(error);

		return process.exit(1);
	}
};
