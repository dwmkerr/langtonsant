# Build the dist package.
build:
	npm install
	npm run bundle

# Serve the built site locally, the way GitHub Pages will.
serve: build
	npx --yes http-server ./dist -o
