module.exports = {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true, // Add this line
        },
      ],
    ],
  };