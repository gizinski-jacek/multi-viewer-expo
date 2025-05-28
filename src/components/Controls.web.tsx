import { hostList } from '@/constants/Hosts';
import { Hosts } from '@/constants/types';
import { capitalizeWords } from '@/libraries/utilities';
import React, { useState } from 'react';
import { Platform } from 'react-native';

interface Props {
	addVideo: (host: Hosts, userInput: string) => void;
	manualGridColSize: 'auto' | 1 | 2;
	toggleLayout: () => void;
}

export default function Controls({
	addVideo,
	manualGridColSize,
	toggleLayout,
}: Props) {
	const [host, setHost] = useState<Hosts>('youtube');
	const [userInput, setUserInput] = useState<string>(
		'https://www.youtube.com/watch?v=TR2EJHpjN48&list=PLfNZzvIXkJUmfka-wZRBOCDn3j2BCDeXn'
	);

	function handleHostChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const { value } = e.target as { value: Hosts };
		setHost(value);
	}

	function handleUserInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setUserInput(value);
	}

	function handleInputEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && host && userInput) {
			setUserInput('');
			addVideo(host, userInput);
		}
	}

	function handleAddVideo() {
		if (!userInput || !host) return;
		setHost('');
		setUserInput('');
		addVideo(host, userInput);
	}

	return (
		<form
			className='flex flex-col gap-1 w-full'
			onSubmit={(e) => e.preventDefault()}
		>
			<div className='flex flex-row gap-1'>
				<fieldset className='flex-1'>
					<label className='hidden capitalize' htmlFor='host'>
						Select host
					</label>
					<select
						className='px-1 w-full text-gray-950 h-full rounded'
						id='host'
						name='host'
						value={host}
						onChange={handleHostChange}
					>
						{hostList.map((host) => (
							<option key={host} value={host}>
								{host
									? host === 'm3u8'
										? host
										: capitalizeWords(host.replace('-', ' '))
									: 'Select host'}
							</option>
						))}
					</select>
				</fieldset>
				<button
					className='button bg-blue-600 py-0 px-2 rounded'
					onClick={handleAddVideo}
				>
					<svg
						width='24px'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
						fill='#000000'
					>
						<g strokeWidth='0'></g>
						<g strokeLinecap='round' strokeLinejoin='round'></g>
						<g>
							<g>
								<g>
									<g>
										<line
											fill='none'
											stroke='#ffffff'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											x1='12'
											x2='12'
											y1='19'
											y2='5'
										></line>
										<line
											fill='none'
											stroke='#ffffff'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											x1='5'
											x2='19'
											y1='12'
											y2='12'
										></line>
									</g>
								</g>
							</g>
						</g>
					</svg>
				</button>
				{Platform.OS === 'web' && (
					<button
						className='button bg-blue-600 py-0 px-2 rounded w-[42px] h-[32px]'
						type='button'
						onClick={toggleLayout}
					>
						{manualGridColSize === 'auto' ? (
							<div className='text-2xl'>A</div>
						) : manualGridColSize === 1 ? (
							<svg
								width='24px'
								viewBox='0 0 24 24'
								fill='#000000'
								transform='rotate(90)'
								xmlns='http://www.w3.org/2000/svg'
							>
								<g strokeWidth='0'></g>
								<g strokeLinecap='round' strokeLinejoin='round'></g>
								<g>
									<g>
										<rect
											x='12'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(34.54 24.07) rotate(180)'
										></rect>
										<rect
											x='1.45'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(13.44 24.07) rotate(180)'
										></rect>
									</g>
								</g>
							</svg>
						) : manualGridColSize === 2 ? (
							<svg
								width='24px'
								viewBox='0 0 24 24'
								fill='#000000'
								xmlns='http://www.w3.org/2000/svg'
							>
								<g strokeWidth='0'></g>
								<g strokeLinecap='round' strokeLinejoin='round'></g>
								<g>
									<g>
										<rect
											x='12'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(34.54 24.07) rotate(180)'
										></rect>
										<rect
											x='1.45'
											y='1.49'
											width='10.55'
											height='21.1'
											fill='none'
											stroke='#ffffff'
											strokeWidth='1.92px'
											strokeMiterlimit={10}
											transform='translate(13.44 24.07) rotate(180)'
										></rect>
									</g>
								</g>
							</svg>
						) : null}
					</button>
				)}
			</div>
			<fieldset>
				<label className='w-full' htmlFor='userInput'>
					Link or ID
				</label>
				<input
					className='p-1 w-full text-gray-950 rounded'
					id='userInput'
					name='userInput'
					type='text'
					value={userInput}
					onChange={handleUserInputChange}
					onKeyDown={handleInputEnterKey}
					placeholder={host === 'm3u8' ? 'm3u8 link' : 'Link or ID'}
				/>
			</fieldset>
		</form>
	);
}
