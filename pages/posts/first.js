import Link from 'next/link'
import Head from 'next/head'
import Container from '../../components/container'

export default function Firstpost(props){
    return (
        <>
            <Container>
                <Head>
                    <title>My first post</title>
                </Head>
                <h1>My first post</h1>
                <h2>
                    <Link href="/" legacyBehavior>
                        <a>Home</a>
                    </Link>
                </h2>
                <br />

                <div>Next stars: {props.stars}</div>

                <img src="/mobile.png" alt="TutorialsPoint Logo"  width={50}  />
            </Container>
        </>
    )
}

export async function getStaticProps(){
    const res = await fetch('https://api.github.com/repos/vercel/next.js');
    const json = await res.json();
    return{
        props:{stars: json.stargazers_count?json.stargazers_count:10}
    }
}