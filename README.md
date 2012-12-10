<h2>$lim JS</h2>

<p>Slim JS is a small JavaScript library built around performance for convenient tasks.  It focuses on typical UI tasks such as event binding and UI construction.  SlimJS employs the use of Plovr (Google Closure Compiler) to enforce typing, annotations, and minimize the file size.  Performance tests are done via JSLitmus and JSPerf.</p>

<h2>Performance</h2>

<p>Since the main focus of $limJS is performance, each major component has some benchmark tests.  The file at tests/index.html has links to each. Some tests are local and performed with JSLitmus (included in the source), while others are done via JSPerf so that it records various browser results.</p>

<h2>Plovr</h2>

<p>Google Closure Compiler is a great tool for libraries because it enforces function parameters and return types, detects certain run-time errors, and can produce documentation.  It also optimize the final code so that file size is as small as possible when deploying to production.  Plovr makes using Google Closure much easier during development.  Neither Plovr nor GC jars are included as part of the $limJS source, you are expected to download and use your own plovr jar.</p>

<h2>Assumptions</h2>

<p>$limJS makes certain assumptions in its approach.  The most major assumption is that document.querySelector and document.querySelectorAll will be present.  This may eliminate it from use when a broad audience is supported but allows it to run quickly on modern browsers, a controlled audience, or in mobile development.  Other assumptions may be made in the performance tests and/or code and will be reflected in this section if they are added in the future.</p>

<h2>Dependencies</h2>

<p>$limJS itself currently depends on Google Closure since it is designed for its compiler.  The internal tests use JSLitmus for running performance tests.  The test pages also use LazyLoad.js to ensure that JSLitmus and $limJS download and execute before any $lim tests are performed.</p>
