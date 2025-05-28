import { VideoData } from '@/constants/types';
import { createIFrameVideoSource } from '@/libraries/utilities';
import HLSWrapper from './HLSWrapper';
import IFrameWrapper from './IFrameWrapper';

interface Props {
	video: VideoData;
	removeVideo: (video: VideoData) => void;
}

export default function VideoWrapper({ video, removeVideo }: Props) {
	return (
		<div className='group w-full min-w-[calc(400px-2rem)] min-h-[270px] relative'>
			<button
				className='opacity-0 group-hover:opacity-100 bg-red-700 absolute top-0 right-0 z-50 transition-all duration-500 border border-black m-[1px] shadow-[0_0_2px_1px] shadow-yellow-600'
				onClick={() => removeVideo(video)}
			>
				<svg
					width='24px'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g strokeLinecap='round' strokeLinejoin='round'></g>
					<g>
						<g>
							<path
								d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
								stroke='#000000'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							></path>
						</g>
					</g>
				</svg>
			</button>
			{video.host === 'm3u8' ? (
				<HLSWrapper url={video.id} />
			) : (
				<IFrameWrapper
					src={createIFrameVideoSource(video.host, video.id)}
					title={video.host && `${video.host} video player`}
				/>
			)}
		</div>
	);
}
