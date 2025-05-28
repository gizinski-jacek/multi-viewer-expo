import { Hosts, VideoData } from '@/constants/types';
import { Image } from 'expo-image';
import React from 'react';
import Controls from './Controls';

interface Props {
	playlist: VideoData[];
	clearPlaylist: () => void;
	togglePlaylist: (value?: boolean) => void;
	manualGridColSize: 'auto' | 1 | 2;
	toggleLayout: () => void;
	addVideo: (host: Hosts, userInput: string) => void;
	removeVideo: (video: VideoData) => void;
	reorderVideo: (video: VideoData, index: number) => void;
}

export default function Playlist({
	playlist,
	clearPlaylist,
	manualGridColSize,
	togglePlaylist,
	toggleLayout,
	addVideo,
	removeVideo,
	reorderVideo,
}: Props) {
	return (
		<div className='h-full w-full flex flex-col gap-5 p-1 bg-gray-900'>
			<Controls
				addVideo={addVideo}
				manualGridColSize={manualGridColSize}
				toggleLayout={toggleLayout}
			/>
			<div className='flex flex-col gap-3'>
				<div className='flex justify-between gap-3'>
					<button
						className='button bg-red-700 grow py-0 px-1 text-black font-bold uppercase rounded'
						onClick={clearPlaylist}
					>
						Clear All
					</button>
					<button
						className='button bg-yellow-600 grow py-0 px-1 text-black font-bold uppercase rounded'
						onClick={() => togglePlaylist(false)}
					>
						Close
					</button>
				</div>
				<ul className='w-full h-full flex flex-col gap-2 overflow-y-auto'>
					{playlist.map((video, index) => (
						<>
							<li key={video.id}>
								<div className='flex flex-row gap-1 text-justify max-h-[90px]'>
									{video.thumbnailUrl ? (
										<Image
											style={{ width: 130, height: 90 }}
											source={{ uri: video.thumbnailUrl }}
											alt={`${video.title} thumbnail` || 'Video thumbnail'}
										/>
									) : (
										<div className='bg-black w-[130px] h-[90px] max-h-[90px] relative after:inline-block after:content-["?"] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:font-gray-700 after:font-bold after:text-center after:text-3xl after:border-2 after:px-[0.6rem] after:pl-[0.65rem] after:pt-[0.2rem] after:border-white after:rounded-[50%]' />
									)}
									<p
										style={{ scrollbarWidth: 'thin' }}
										className='grow m-0 max-h-[90px] overflow-y-auto text-base/5'
									>
										{video.title}
									</p>
									<div className='flex flex-col justify-between'>
										<button
											className='button bg-red-700 rounded-0 p-0'
											onClick={() => removeVideo(video)}
										>
											<svg
												width='24px'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g strokeWidth='0'></g>
												<g strokeLinecap='round' strokeLinejoin='round'></g>
												<g>
													<path
														d='M7 17L16.8995 7.10051'
														stroke='#000000'
														strokeWidth='1.5'
														strokeLinecap='round'
														strokeLinejoin='round'
													></path>
													<path
														d='M7 7.00001L16.8995 16.8995'
														stroke='#000000'
														strokeWidth='1.5'
														strokeLinecap='round'
														strokeLinejoin='round'
													></path>
												</g>
											</svg>
										</button>
										<button
											className='button bg-yellow-600 rounded-0 p-0'
											onClick={() => reorderVideo(video, index - 1)}
											disabled={index === 0 || playlist.length < 2}
										>
											<svg
												width='24px'
												fill='#000000'
												viewBox='0 0 32 32'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g strokeWidth='0'></g>
												<g strokeLinecap='round' strokeLinejoin='round'></g>
												<g>
													<path d='M8 20.695l7.997-11.39L24 20.695z'></path>
												</g>
											</svg>
										</button>
										<button
											className='button bg-yellow-600 rounded-0 p-0'
											onClick={() => reorderVideo(video, index + 1)}
											disabled={
												index === playlist.length - 1 || playlist.length < 2
											}
										>
											<svg
												width='24px'
												fill='#000000'
												viewBox='0 0 32 32'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g strokeWidth='0'></g>
												<g strokeLinecap='round' strokeLinejoin='round'></g>
												<g>
													<path d='M24 11.305l-7.997 11.39L8 11.305z'></path>
												</g>
											</svg>
										</button>
									</div>
								</div>
							</li>
							{index !== playlist.length - 1 && (
								<hr className='block border-1 border-yellow-300' />
							)}
						</>
					))}
				</ul>
			</div>
		</div>
	);
}
