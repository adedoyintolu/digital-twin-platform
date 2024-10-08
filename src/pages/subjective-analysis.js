import * as React from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import SubjectiveAnalysisComponent from '../../src/components/SubjectiveAnalysis/SubjectiveAnalysis.jsx'
import { Typography } from '@mui/material';

export default function SubjectiveEvaluation() {
  return (
    <>
    <div className={styles.container}>
      <Head>
        <title>Subjective Analysis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: 1}}>
        {/* <Typography variant='h4' sx={{textAlign: 'center', marginTop: 0}} >
          Subjective Analysis
        </Typography> */}
        <h1 className={styles.title}>
        </h1>
         <SubjectiveAnalysisComponent/>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
    </>
  );
}
