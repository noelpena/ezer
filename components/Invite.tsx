import React from "react";

export default function Invite() {
	return (
		<main style={container}>
			<div style={main}>
				<table
					align="center"
					width="100%"
					cellPadding="0"
					cellSpacing="0"
					role="presentation"
					style={table}
				>
					<tbody>
						<tr style={{ width: "100%" }}>
							<td>
								<img
									alt="Koala"
									height="50"
									src="https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/koala-logo.png"
									style={logo}
									width="170"
								/>
								<p style={paragraph}>Hi Alan,</p>
								<p style={paragraph}>
									Welcome to Koala, the sales intelligence
									platform that helps you uncover qualified
									leads and close deals faster.
								</p>
								<br />
								<table
									align="center"
									width="100%"
									cellPadding="0"
									cellSpacing="0"
									role="presentation"
									style={{ textAlign: "center" }}
								>
									<tbody>
										<tr>
											<td>
												<a
													href="https://ezer.noelpena.com"
													style={button}
													target="_blank"
												>
													<span
														style={{
															maxWidth: "100%",
															display:
																"inline-block",
															lineHeight: "120%",
														}}
													>
														Get started
													</span>
												</a>
											</td>
										</tr>
									</tbody>
								</table>
								<br />
								<p style={paragraph}>
									Best,
									<br />
									The Ezer team
								</p>
								<hr style={hr} />
								{/* <p style={paragraph}>
									470 Noor Ave STE B #1148, South San
									Francisco, CA 94080
								</p> */}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</main>
	);
}

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const table = {
	maxWidth: "37.5em",
	margin: "0 auto",
	padding: "20px 0 48px",
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
};

const logo = {
	margin: "0 auto",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const btnContainer = {
	textAlign: "center" as const,
};

const button = {
	backgroundColor: "#5F51E8",
	borderRadius: "3px",
	color: "#fff",
	fontSize: "16px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "12px",
};

const hr = {
	borderColor: "#cccccc",
	margin: "20px 0",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
};
