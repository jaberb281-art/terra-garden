const assert=require('node:assert/strict');const fs=require('node:fs');const ts=require('typescript');const Module=require('node:module');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpile(fs.readFileSync(f,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}),f);
const original=Module._resolveFilename;
Module._resolveFilename=function(s,...args){return original.call(this,s.startsWith('@/')?require('node:path').resolve('src',s.slice(2)):s,...args);};
process.env.NEXT_PUBLIC_SITE_URL='https://terra-qa.qa';
process.env.SITE_ALLOW_INDEXING='true';
const config=require('../src/content/config.ts');
const robots=require('../src/app/robots.ts').default;
const sitemap=require('../src/app/sitemap.ts').default;
assert(config.indexable);
assert.equal(sitemap().length,26);
assert.equal(robots().sitemap,'https://terra-qa.qa/sitemap.xml');
for(const p of config.publicPaths){
  for(const l of ['en','ar']){
    const m=config.metadata(l,p,{en:'English',ar:'عربي'},{en:'English description',ar:'وصف عربي'});
    assert.equal(m.alternates.canonical,'https://terra-qa.qa/'+l+p);
    assert.equal(m.alternates.languages.en,'https://terra-qa.qa/en'+p);
    assert.equal(m.alternates.languages.ar,'https://terra-qa.qa/ar'+p);
    assert.equal(m.alternates.languages['x-default'],'https://terra-qa.qa/en'+p);
    assert(m.openGraph.images[0].url.startsWith('https://terra-qa.qa/images/'));
  }
}
console.log('Verified configured SEO: 26 sitemap entries, reciprocal hreflang, canonicals, robots, and social image URLs.');
