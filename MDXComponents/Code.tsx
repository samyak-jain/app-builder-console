import React, {useRef, useState} from 'react';
import Highlight, {Language, Prism} from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const CopyButton = (ref: React.RefObject<HTMLPreElement>) => {
  async function copyToClip() {
    if (ref.current) {
      const code = ref.current.innerText;
      await navigator.clipboard.writeText(code);
    }
    console.log('code copied!');
    setCopied(true);
  }
  const [copied, setCopied] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setCopied(false)}>
      <Button
        color="primary"
        onClick={copyToClip}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          opacity: copied ? 1 : 0.5,
        }}>
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </ClickAwayListener>
  );
};

const Code = ({
  children,
  className,
}: // ...rest
{
  children: string;
  className: string;
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const language = className.replace(/language-/, '') as Language;
  // console.log(rest);
  return (
    <div style={{position: 'relative'}}>
      <Highlight
        theme={vsDark}
        Prism={Prism}
        code={children}
        language={language}>
        {({
          className: codeClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            ref={codeRef}
            className={codeClassName}
            style={{...style, padding: '20px'}}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({line, key: i})}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({token, key})} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <CopyButton {...codeRef} />
    </div>
  );
};

export default Code;
