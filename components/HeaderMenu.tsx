import {
	Menu,
	Group,
	Center,
	Burger,
	Container,
	Title,
	Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import Image from "next/image";
import classes from "@/styles/HeaderMenu.module.css";
import { MouseEventHandler } from "react";
import Link from "next/link";

const links = [
	{ link: "/view/records", label: "View Records" },
	{
		link: "#1",
		label: "Create New",
		links: [
			{ link: "/records/new", label: "Record" },
			{ link: "/resources", label: "Department" },
			{ link: "/community", label: "Member" },
			{ link: "/blog", label: "Balance" },
		],
	},
	{ link: "/about", label: "Reports" },
	// { link: "/pricing", label: "Pricing" },
	// {
	// 	link: "#2",
	// 	label: "Support",
	// 	links: [
	// 		{ link: "/faq", label: "FAQ" },
	// 		{ link: "/demo", label: "Book a demo" },
	// 		{ link: "/forums", label: "Forums" },
	// 	],
	// },
];

type AppProps = {
	isLoggedIn: boolean;
	handleSignOut: MouseEventHandler<HTMLButtonElement>;
};

const HeaderMenu = ({ isLoggedIn, handleSignOut }: AppProps) => {
	const [opened, { toggle }] = useDisclosure(false);

	const items = links.map((link) => {
		const menuItems = link.links?.map((item) => (
			<Menu.Item key={item.link}>
				<Link href={item.link.toString()}>{item.label}</Link>
			</Menu.Item>
		));

		if (menuItems) {
			return (
				<Menu
					key={link.label}
					trigger="hover"
					transitionProps={{ exitDuration: 0 }}
					withinPortal
				>
					<Menu.Target>
						<Link
							href={link.link}
							className={classes.link}
							// onClick={(event) => event.preventDefault()}
						>
							<Center>
								<span className={classes.linkLabel}>
									{link.label}
								</span>
								<IconChevronDown size="0.9rem" stroke={1.5} />
							</Center>
						</Link>
					</Menu.Target>
					<Menu.Dropdown>{menuItems}</Menu.Dropdown>
				</Menu>
			);
		}

		return (
			<Link
				key={link.label}
				href={link.link}
				className={classes.link}
				// onClick={(event) => event.preventDefault()}
			>
				{link.label}
			</Link>
		);
	});

	return (
		<header className={classes.header}>
			<Container size="lg">
				<div className={classes.inner}>
					<Link href="/dashboard">
						<Title order={1}>Ezer</Title>
					</Link>
					<Group gap={5} visibleFrom="sm">
						{items}
					</Group>
					<Burger
						opened={opened}
						onClick={toggle}
						size="sm"
						hiddenFrom="sm"
					/>
					{isLoggedIn ? (
						<Button variant="filled" onClick={handleSignOut}>
							Sign out
						</Button>
					) : (
						<Group visibleFrom="sm">
							<Button variant="filled">Log in</Button>
							<Button>Sign up</Button>
						</Group>
					)}
				</div>
			</Container>
		</header>
	);
};

export default HeaderMenu;
