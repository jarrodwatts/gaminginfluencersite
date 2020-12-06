import useSWR from 'swr'

export default function Test() {
    const { data, error } = useSWR('/api/getFood', fetch)

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    return <div>hello {data.name}!</div>
}