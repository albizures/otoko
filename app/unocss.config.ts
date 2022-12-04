import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
	presets: [presetAttributify({}), presetUno({})],
	transformers: [transformerVariantGroup()],
});
