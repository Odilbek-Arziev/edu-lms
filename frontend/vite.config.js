import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            'bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            'Components': path.resolve(__dirname, 'src/Components'),
            'assets': path.resolve(__dirname, 'src/assets'),
            'common': path.resolve(__dirname, 'src/common'),
            'Layouts': path.resolve(__dirname, 'src/Layouts'),
            'pages': path.resolve(__dirname, 'src/pages'),
            'slices': path.resolve(__dirname, 'src/slices'),
            'helpers': path.resolve(__dirname, 'src/helpers'),
            'Routes': path.resolve(__dirname, 'src/Routes'),
            'config': path.resolve(__dirname, 'src/config'),
            events: 'events',
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: ['node_modules'],
                quietDeps: true,
                silenceDeprecations: ['import', 'slash-div', 'global-builtin', 'color-functions', 'if-function'],
            },
        },
    },
    define: {
        global: 'window',
        'process.env': {},
    },
});