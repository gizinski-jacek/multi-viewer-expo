type ConditionalProps =
	| { renderContent: boolean; contentCollapsed: boolean }
	| { renderContent?: undefined; contentCollapsed?: never };

type DefaultProps = {
	drawerPosition?: 'fixed' | 'static';
	drawerSide?: 'left' | 'right';
	showDrawer: boolean;
	toggleDrawer: (value?: boolean) => void;
	children: React.ReactNode;
};

type Props = ConditionalProps & DefaultProps;

export default function DrawerComponent({
	drawerPosition = 'fixed',
	drawerSide = 'left',
	renderContent = true,
	contentCollapsed = true,
	showDrawer,
	toggleDrawer,
	children,
}: Props) {
	const containerStyle: {
		fixed: { left: string; right: string };
		static: { left: string; right: string };
	} = {
		fixed: {
			left: `left-0 ${showDrawer ? 'translate-x-0' : '-translate-x-full'}`,
			right: `right-0 ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`,
		},
		static: {
			left: showDrawer
				? 'w-[300px]'
				: 'w-[10px] -translate-x-[calc(100%-10px)]',
			right: showDrawer
				? 'w-[300px]'
				: 'w-[10px] translate-x-[calc(100%-10px)]',
		},
	};

	if (drawerPosition === 'fixed') {
		return (
			<div
				className={`fixed top-0 z-[100] flex w-[300px] h-full bg-gray-900 transition-all duration-500 ${containerStyle[drawerPosition][drawerSide]}`}
			>
				<div
					className={`w-full h-full overflow-y-auto ${
						renderContent ? '' : contentCollapsed ? 'hidden' : 'block'
					}`}
				>
					{children}
				</div>
				<div
					className={`h-full w-[10px] top-0 bg-gray-400 cursor-pointer transition-all hover:brightness-125 active:brightness-150 absolute ${
						drawerSide === 'left' ? 'left-full' : 'right-full'
					} `}
					onClick={() => toggleDrawer()}
				></div>
			</div>
		);
	}

	return (
		<div
			className={`flex h-full bg-gray-900 transition-all duration-500 ${containerStyle[drawerPosition][drawerSide]}`}
		>
			<div
				className={`h-full overflow-y-auto whitespace-nowrap shrink-0 order-2 transition-all duration-500 ${
					showDrawer ? 'w-[290px]' : 'w-0 -translate-x-full'
				} ${renderContent ? '' : contentCollapsed ? 'hidden' : 'block'}`}
			>
				{children}
			</div>
			<div
				className={`h-full w-[10px] top-0 bg-gray-400 cursor-pointer transition-all hover:brightness-125 active:brightness-150 ${
					drawerSide === 'left' ? 'order-3' : 'order-1'
				} `}
				onClick={() => toggleDrawer()}
			></div>
		</div>
	);
}
