import DrawerComponent from '@/components/DrawerComponent';
import Loading from '@/components/Loading';
import Playlist from '@/components/Playlist';
import VideoWrapper from '@/components/wrappers/VideoWrapper';
import { Hosts, VideoData } from '@/constants/types';
import {
	createURLParams,
	extractVideoId,
	formatFetchError,
	getDataFromParams,
	getVideoData,
} from '@/libraries/utilities';
import { useSearchParams } from 'expo-router/build/hooks';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

export default function HomeScreen() {
	const videoListParams = useSearchParams()?.get('list');
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [videoListData, setVideoListData] = useState<VideoData[]>([]);
	const [showChat, setShowChat] = useState<boolean>(false);
	const [chatIsCollapsed, setChatIsCollapsed] = useState<boolean>(true);
	const [activeChat, setActiveChat] = useState<VideoData | null>(null);
	const [gridColSize, setGridColSize] = useState<1 | 2>(1);
	const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
	const [manualGridColSize, setManualGridColSize] = useState<'auto' | 1 | 2>(
		'auto'
	);

	useEffect(() => {
		(async () => {
			try {
				if (!videoListParams || videoListData.length > 0) return;
				const videoData = await getDataFromParams(videoListParams);
				setVideoListData(videoData);
			} catch (error: unknown) {
				setError(formatFetchError(error).message);
				setFetching(false);
			}
		})();
	}, [videoListParams, videoListData, setVideoListData]);

	async function handleAddVideo(host: Hosts, userInput: string) {
		try {
			if (!userInput) {
				setError('Provide video link or Id');
				return;
			}
			if (!host) {
				setError('Select video host');
				return;
			}
			if (fetching) return;
			setFetching(true);
			setError(null);
			const id = extractVideoId(host, userInput);
			if (!id) {
				setError('Unsupported host or incorrect Id');
				return;
			}
			const videoOnList = videoListData.find(
				(video) => video.id === id && video.host === host
			);
			if (videoOnList) {
				setError('Video already on the list');
				return;
			}
			const data = await getVideoData(host, id);
			const newVideoDataState = [...videoListData, data];
			const params = createURLParams(newVideoDataState);
			window.history.pushState(
				null,
				'',
				params || window.location.origin + window.location.pathname
			);
			setVideoListData(newVideoDataState);
			setFetching(false);
		} catch (error: unknown) {
			setError(formatFetchError(error).message);
			setFetching(false);
		}
	}

	function handleRemoveVideo(video: VideoData) {
		if (!video) {
			setError('Error removing video');
			return;
		}
		const newVideoDataState = videoListData.filter((vid) =>
			vid.id === video.id ? (vid.host === video.host ? false : true) : true
		);
		const newParams = createURLParams(newVideoDataState);
		window.history.pushState(
			null,
			'',
			newParams || window.location.origin + window.location.pathname
		);
		setVideoListData(newVideoDataState);
		if (activeChat?.id === video.id && activeChat.host === video.host) {
			setActiveChat(null);
			setShowChat(false);
		}
	}

	function handleReorderVideo(video: VideoData, targetIndex: number) {
		// ! Find reason why videos pushed down the list (higher index) by items moved
		// ! up the list (lower index) get re-rendered while others do not.
		if (videoListData.length < 2 || !video || targetIndex === undefined) {
			return;
		}
		const newState = videoListData.filter((vid) =>
			vid.id === video.id ? (vid.host === video.host ? false : true) : true
		);
		if (targetIndex < 0) {
			newState.splice(videoListData.length - 1, 0, video);
		} else if (targetIndex >= videoListData.length) {
			newState.splice(0, 0, video);
		} else {
			newState.splice(targetIndex, 0, video);
		}
		const newParams = createURLParams(newState);
		window.history.pushState(
			null,
			'',
			newParams || window.location.origin + window.location.pathname
		);
		setVideoListData(newState);
	}

	function handleClearPlaylist() {
		window.history.pushState(
			null,
			'',
			window.location.origin + window.location.pathname
		);
		setVideoListData([]);
	}

	const watchResize = useCallback(() => {
		if (screen.orientation.type === 'landscape-primary') {
			if (window.innerWidth < 768) {
				setGridColSize(1);
			}
			if (window.innerWidth >= 768 && window.innerWidth < 1100) {
				if (videoListData.length > 1) {
					if (showChat || showPlaylist) {
						setGridColSize(1);
					} else {
						setGridColSize(2);
					}
				} else {
					setGridColSize(1);
				}
			}
			if (window.innerWidth >= 1100) {
				if (videoListData.length > 1) {
					setGridColSize(2);
				} else {
					setGridColSize(1);
				}
			}
		} else if (screen.orientation.type === 'portrait-primary') {
			if (window.innerHeight < 768) {
				setGridColSize(1);
			}
			if (window.innerHeight >= 768 && window.innerHeight < 1100) {
				if (videoListData.length > 4) {
					if (showChat || showPlaylist) {
						setGridColSize(1);
					} else {
						setGridColSize(2);
					}
				} else {
					setGridColSize(1);
				}
			}
			if (window.innerHeight >= 1100) {
				if (videoListData.length > 4) {
					setGridColSize(2);
				} else {
					setGridColSize(1);
				}
			}
		}
	}, [videoListData, showChat, showPlaylist]);

	useEffect(() => {
		if (manualGridColSize !== 'auto') return;
		watchResize();
	}, [manualGridColSize, videoListData, showChat, watchResize]);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		window.addEventListener('resize', watchResize);

		return () => window.removeEventListener('resize', watchResize);
	}, [watchResize]);

	function dismissError() {
		setError(null);
	}

	function handleTogglePlaylist(value?: boolean) {
		setShowPlaylist((prevState) => value || !prevState);
	}

	function handleToggleChat(value?: boolean) {
		setShowChat((prevState) => value || !prevState);
	}

	function handleToggleLayout() {
		if (manualGridColSize === 'auto') {
			setManualGridColSize(1);
		} else if (manualGridColSize === 1) {
			setManualGridColSize(2);
		} else if (manualGridColSize === 2) {
			setManualGridColSize('auto');
		}
	}

	useEffect(() => {
		if (!showChat) {
			const timer = setTimeout(() => {
				setChatIsCollapsed(true);
			}, 500);
			return () => clearTimeout(timer);
		} else {
			setChatIsCollapsed(false);
		}
	}, [showChat]);

	return (
		<div
			className={`bg-gray-950 flex flex-row w-full h-full overflow-y-auto overflow-x-hidden px-[10px] ${
				Platform.OS === 'web' ? 'pr-0' : ''
			}`}
		>
			<DrawerComponent
				drawerSide='left'
				showDrawer={showPlaylist}
				toggleDrawer={handleTogglePlaylist}
			>
				<Playlist
					playlist={videoListData}
					clearPlaylist={handleClearPlaylist}
					togglePlaylist={handleTogglePlaylist}
					manualGridColSize={manualGridColSize}
					toggleLayout={handleToggleLayout}
					addVideo={handleAddVideo}
					removeVideo={handleRemoveVideo}
					reorderVideo={handleReorderVideo}
				/>
			</DrawerComponent>
			{error && !!videoListData.length && (
				<div
					className='absolute top-0 left-0 right-0 z-[100] p-1 text-3xl font-bold text-center text-white bg-red-700 shadow-[0_0_4px_1px] shadow-red-700 transition-all hover:brightness-125 active:brightness-150 cursor-pointer select-none'
					onClick={dismissError}
				>
					{error}
				</div>
			)}
			<div
				className={`flex-1 grid ${
					manualGridColSize === 'auto'
						? gridColSize === 1
							? 'grid-cols-1'
							: 'grid-cols-2'
						: manualGridColSize === 1
						? 'grid-cols-1'
						: 'grid-cols-2'
				}`}
			>
				{videoListData.map((video) => (
					<VideoWrapper
						key={video.id}
						video={video}
						removeVideo={handleRemoveVideo}
					/>
				))}
				{fetching && (
					<div className='absolute top-0 left-0 right-0 bottom-0 bg-gray-900 z-[500] opacity-[0.75]'>
						<Loading styleClass='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
					</div>
				)}
				{error && !videoListData.length && (
					<div
						className='w-fit h-fit p-4 m-auto text-3xl font-bold text-center text-white bg-red-700 rounded-lg border-4 border-black shadow-[0_0_4px_1px] shadow-red-700 transition-all hover:brightness-125 active:brightness-150 cursor-pointer select-none'
						onClick={dismissError}
					>
						{error}
					</div>
				)}
			</div>
			<DrawerComponent
				drawerPosition={Platform.OS === 'web' ? 'static' : 'fixed'}
				drawerSide='right'
				renderContent={false}
				contentCollapsed={chatIsCollapsed}
				showDrawer={showChat}
				toggleDrawer={handleToggleChat}
			>
				Here goes chat
			</DrawerComponent>
		</div>
	);
}
