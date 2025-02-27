import React, {useEffect, useRef} from 'react';
import Typography, {TypographyProps} from '@material-ui/core/Typography';
import {makeStyles, createStyles} from '@material-ui/core/styles';
import useActiveLink from './useActiveLink';

const useStyles = makeStyles(
  createStyles({
    headingText: {
      marginTop: '40px',
      marginBottom: '10px',
      fontWeight: 700,
    },
  }),
);
const H2 = (props: TypographyProps) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const classes = useStyles();
  const {setLink} = useActiveLink();
  // const [observe, unobserve] = useAnchorBind();
  useEffect(() => {
    const element = ref.current as HTMLHeadingElement;
    function intersectionCallback(entries: Array<IntersectionObserverEntry>) {
      entries.forEach(function (entry) {
        let heading = entry.target;

        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.75) {
            // intersecting.push(heading.id);
            setLink(heading.id);
            // console.log('[In view] : ', heading.id);
          }
        } else {
          // intersecting.filter((h) => h !== heading.id);
          // console.log('[Removing] : ', heading.id);
        }
      });
    }
    let observerOptions = {
      // root: null,
      // rootMargin: "0px",
      threshold: [1],
    };
    const headingObserver = new IntersectionObserver(
      intersectionCallback,
      observerOptions,
    );
    headingObserver.observe(element);
    return () => {
      headingObserver.unobserve(element);
    };
  }, [setLink]);
  return (
    <Typography
      ref={ref}
      className={classes.headingText}
      variant={'h2'}
      {...props}
    />
  );
};

export default H2;
