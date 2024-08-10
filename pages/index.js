import Router from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

function Homepage(props){
    console.log('reac')
    return ( 
        <>
            <Head>
                <title>Welcome to Next.js!</title>
            </Head>
            <div>Welcome to next js!</div>
            <Link href="/posts/first" legacyBehavior>
                <a>First post</a>
            </Link>

            <br />

            <span onClick={() => Router.push('/posts/one')}>First Post</span>

            <span onClick={() => Router.push('/?counter=1', undefined, { shallow: true })}>Reload</span>

            <div>Next stars: {props.stars}</div>

            <img src='/mobile.png' width={50} />
        </>
    )
}

export async function getServerSideProps(context){
    const res = await fetch('https://api.github.com/repos/vercel/next.js');
    const json = await res.json();
    return{
        props:{stars: json.stargazers_count?json.stargazers_count:10}
    }
}

export default Homepage;