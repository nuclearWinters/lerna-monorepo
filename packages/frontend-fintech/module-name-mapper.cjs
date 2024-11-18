const { dirname, relative } = require('path');

const mapModuleNames = (path, opts, fileOpts) => {
  const {moduleNameMapper, resolveRelativePaths = true} = opts;
  const {root, filename} = fileOpts;
  if (!moduleNameMapper) {
    return path;
  }
  const fileDirname = dirname(filename);
  let nextPath = path;
  Object.keys(moduleNameMapper).forEach(find => {
    const replace = moduleNameMapper[find];
    const matches = path.match(new RegExp(find));
    if (!matches) {
      return;
    }
    nextPath = replace;
    const replaceUsesRootDir = replace.includes('<rootDir>');
    if (replaceUsesRootDir) {
      nextPath = nextPath.replace('<rootDir>', root);
    }
    const replaceCouldBeRelative = replaceUsesRootDir;
    if (replaceCouldBeRelative && resolveRelativePaths) {
      nextPath = relative(fileDirname, nextPath);
      // Handle siblings/children paths
      if (!nextPath.startsWith('.')) {
        nextPath = `./${nextPath}`;
      }
    }
  });

  return nextPath;
};

module.exports = ({types: t}) => {
  const visitor = {
    CallExpression(path, state) {
      if (!(path.node.callee.name === 'require' || t.isImport(path.node.callee))) {
        return;
      }

      const args = path.node.arguments;
      if (!args.length) {
        return;
      }

      const firstArg = traverseExpression(t, args[0]);

      if (firstArg) {
        firstArg.value = mapModuleNames(firstArg.value, state.opts, state.file.opts);
      }
    },
    ImportDeclaration(path, state) {
      path.node.source.value = mapModuleNames(path.node.source.value, state.opts, state.file.opts); // eslint-disable-line no-param-reassign
    },
    ExportNamedDeclaration(path, state) {
      if (path.node.source) {
        path.node.source.value = mapModuleNames(path.node.source.value, state.opts, state.file.opts); // eslint-disable-line no-param-reassign
      }
    },
    ExportAllDeclaration(path, state) {
      if (path.node.source) {
        path.node.source.value = mapModuleNames(path.node.source.value, state.opts, state.file.opts); // eslint-disable-line no-param-reassign
      }
    }
  };
  return {
    visitor: {
      Program(path, state) {
        path.traverse(visitor, state);
      }
    }
  };
};

const traverseExpression = (t, arg) => {
  if (t.isStringLiteral(arg)) {
    return arg;
  }
  if (t.isBinaryExpression(arg)) {
    return traverseExpression(t, arg.left);
  }
  return null;
};