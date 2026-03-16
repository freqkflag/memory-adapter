# E-Lang v0.2.0 Released

**E-Lang** is a formal symbolic language for representing emotional experience prior to linguistic labeling. Version 0.2.0 adds grammar-complete parsing, API documentation, and JSON Schema interoperability to the frozen v0.1 specification.

**What is frozen:** Grammar (`ELANG.abnf`), axis set (`V,A,C,S,K,D,B,N`), operator set, and canonical syntax are locked. Breaking changes require a major version bump.

**What v0.2.0 adds:** Reference parser supporting all grammar constructs, complete API documentation (`PARSER_API.md`), JSON Schemas for state and AST interchange, and adoption documentation (tutorial, developer guide, extensions guide).

**What is out of scope:** Semantic interpretation, expression evaluation, diagnosis, therapy, automated inference, emotion taxonomies, and normative judgments. E-Lang provides representation infrastructure only; interpretation is optional and separate.

**Repository:** https://github.com/freqkflag/e-lang  
**DOI:** [Zenodo DOI placeholder — to be minted]  
**License:** MIT

**Getting started:** See `TUTORIAL.md` for users, `DEVELOPER_GUIDE.md` for tool builders.

E-Lang is infrastructure, not instruction. Representation is structural; interpretation is optional.