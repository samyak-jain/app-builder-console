import React from 'react';
import {Button, Box, Snackbar} from '@material-ui/core';
import type {LogoStateType, LogoType} from '../pages/builder';
import {UploadStyles} from '../styles/UploadStyles';
import MuiAlert from '@material-ui/lab/Alert';
interface UploadProps {
  name: LogoType;
  handler: Function;
  value: string;
}
function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Upload(props: UploadProps) {
  const classes = UploadStyles();
  const [SelectedImg, setSelectedImg] = React.useState<LogoStateType | any>(
    null,
  );
  const [uploadErr,setUploadErr] = React.useState<string>('');
  const hiddenInputElement = React.useRef<any>(null);
  const hiddenUploadBtnElement = React.useRef<any>(null);

  React.useEffect(() => {
    const objValue: string | null = localStorage.getItem(props.name);
    if (props.value !== '') {
      let obj:any;
      if(objValue){
        obj = JSON.parse(objValue);
      } else {
        obj = {baseString:"",name:props.name}
      }
      
      obj.baseString = props.value;
      if (obj) {
        setSelectedImg(obj);
      }
    } else {
      setSelectedImg(null);
    }
  }, [props.value]);

  function blobToDataURL(blob: Blob, callback: Function) {
    var a = new FileReader();
    a.onload = function (e: any) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file =
      event.target.files && event.target.files.length > 0
        ? event.target.files[0]
        : SelectedImg;
    if(file && (file.size / (1024*1024))<4){
      setSelectedImg(() => file);
      onSubmitClick(file);
    } else {
      setUploadErr(()=>"Please upload a file less than 1 MB. ")
    }
  };

  const onSubmitClick = (selectedFile: any) => {
    if (selectedFile && selectedFile !== null) {
      if (!selectedFile.baseString) {
        blobToDataURL(selectedFile, function (dataurl: string | null) {
          localStorage.setItem(
            props.name,
            JSON.stringify({
              baseString: '',
              name: selectedFile.name,
            }),
          );
          const img: any = new Image();
          img.src = dataurl;
          img.onload = () => {
            props.handler(dataurl, props.name);
          };
        });
      } else {
        props.handler(selectedFile.baseString, props.name);
      }
    }
  };

  const extensions: string[] = [
    'jpeg',
    'jpg',
    'png',
    'webp',
    'tiff',
    'tif',
    'gif',
    'svg',
  ];

  return (
    <>
      <input
        ref={hiddenInputElement}
        type="file"
        onChange={handleFileUpload}
        style={{display: 'none'}}
        accept={extensions.reduce(
          (acc, curr, idx) => `${idx === 1 ? '.' : ''}${acc},.${curr}`,
        )}
        id="file"
      />
      <Button
        variant="outlined"
        color="primary"
        component="label"
        className={classes.uploadBox}
        disabled={SelectedImg}
        onClick={() => {
          hiddenInputElement.current.click();
        }}>
        <div
          color="primary"
          style={{
            textAlign: 'center',
            margin: '8px auto 12px auto',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            height: '20px',
            width: '120px',
          }}>
          {SelectedImg ? SelectedImg.name : 'Select a file'}
        </div>
        {/* {SelectedImg && <img src="./Delete.svg" alt="..." onClick={(event) => {
          event.stopPropagation();
          setSelectedImg(null);
          hiddenInputElement.current.value = "";
          localStorage.removeItem(props.name);
          props.handler(null, props.name);
        }} />} */}
      </Button>
      {SelectedImg && (
        <Box
          fontSize="12px"
          lineHeight={2}
          style={{cursor: 'pointer'}}
          ml={6}
          color="red"
          onClick={(event) => {
            event.stopPropagation();
            setSelectedImg(null);
            hiddenInputElement.current.value = '';
            localStorage.removeItem(props.name);
            props.handler(null, props.name);
          }}>
          Remove Image.
        </Box>
      )}
      <Button
        ref={hiddenUploadBtnElement}
        variant="outlined"
        color="primary"
        component="label"
        className={classes.uploadBtn}
        onClick={() => {
          onSubmitClick(SelectedImg);
        }}>
        Upload
      </Button>
      <Snackbar
        open={uploadErr !== ''}
        anchorOrigin={{vertical:'top', horizontal:'center'}}
        autoHideDuration={6000}
        onClose={() => {
          setUploadErr('');
        }}>
        <Alert
          onClose={() => {
            setUploadErr('');
          }}
          severity="error">
          {uploadErr}
        </Alert>
      </Snackbar>
    </>
  );
}
