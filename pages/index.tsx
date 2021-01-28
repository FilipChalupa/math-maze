import Link from 'next/link'
import React from 'react'
import s from '../styles/Home.module.css'

export default function Home() {
	return (
		<div className={s.container}>
			<ul>
				<li>
					<Link href="/map?s=asd">
						<a>První</a>
					</Link>
				</li>
				<li>
					<Link href="/map?s=acc">
						<a>Druhý</a>
					</Link>
				</li>
			</ul>
		</div>
	)
}
