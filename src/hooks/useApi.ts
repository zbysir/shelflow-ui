import {useState} from 'react'

export default (apiFunc: any) => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const request = async (...args: any[]) => {
        setLoading(true)
        try {
            const result = await apiFunc(...args)
            setData(result)
        } catch (err: any) {
            setError(err || 'Unexpected Error!')
        } finally {
            console.log('finally')
            setLoading(false)
        }
    }

    return {
        data,
        error,
        loading,
        request
    }
}