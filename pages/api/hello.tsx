import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	name: string
}

export default (request: NextApiRequest, response: NextApiResponse<Data>) => {
	response.statusCode = 200
	response.json({ name: 'John Doe' })
}
