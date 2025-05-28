export type Hosts =
	| ''
	| 'youtube'
	| 'youtube-playlist'
	| 'twitch'
	| 'twitch-vod'
	| 'dailymotion'
	| 'dailymotion-playlist'
	| 'vimeo'
	| 'm3u8';

export interface VideoData {
	host: Hosts;
	id: string;
	title: string;
	channelId: string;
	channelName: string;
	livestreamChat: boolean;
	thumbnailUrl: string | null;
}
