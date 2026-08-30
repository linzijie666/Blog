import { useLayoutEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Download, Mail } from "lucide-react";
import { getArticleBySlug } from "./articles.js";
import { resetArticleScroll, scrollToArticleSection } from "./route.js";

export default function ArticleShell({ article, email, children }) {
  const mainRef = useRef(null);
  const previous = getArticleBySlug(article.previousSlug);
  const next = getArticleBySlug(article.nextSlug);
  const downloadHref = `${import.meta.env.BASE_URL}${article.download.href}`;

  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.title = `${article.title} | LzjEngineer`;
    resetArticleScroll();
    mainRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = previousTitle;
    };
  }, [article.title]);

  return (
    <div className="article-page">
      <header className="article-site-header">
        <a className="brand" href="./#hero" aria-label="返回博客首页">
          <span className="brand-mark">LZJ</span>
          <span><strong>LzjEngineer</strong><small>Knowledge Notes</small></span>
        </a>
        <a className="header-contact" href={`mailto:${email}`}><Mail size={17} />Contact</a>
      </header>

      <main className="article-layout" ref={mainRef} tabIndex="-1">
        <article className="knowledge-article">
          <header className="article-hero">
            <a className="article-back" href="./#knowledge"><ArrowLeft size={18} />返回知识专栏</a>
            <p className="eyebrow">{article.category} / {article.readingTime}</p>
            <h1>{article.title}</h1>
            <p className="article-lead">{article.summary}</p>
          </header>

          <nav className="article-toc" aria-label="文章目录">
            {article.sections.map(([id, title]) => (
              <a
                href={article.hash}
                key={id}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToArticleSection(id);
                }}
              >
                {title}
              </a>
            ))}
          </nav>

          {children}

          <footer className="article-footer">
            <div>
              <p className="eyebrow">Source Notes</p>
              <h2>继续查看完整图文课件</h2>
              <p>下载 {article.download.pages} 页原始复习资料，文章中的来源页码可与课件对应查阅。</p>
              <a className="article-download" href={downloadHref} download>
                <Download size={18} />下载完整复习课件 PDF
              </a>
            </div>
            {(previous || next) && (
              <nav className="article-pagination" aria-label="文章翻页">
                {previous ? <a href={previous.hash}><ArrowLeft size={17} /><span>上一篇<small>{previous.title}</small></span></a> : <span />}
                {next ? <a href={next.hash}><span>下一篇<small>{next.title}</small></span><ArrowRight size={17} /></a> : <span />}
              </nav>
            )}
          </footer>
        </article>
      </main>
    </div>
  );
}
