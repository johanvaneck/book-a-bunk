<script>
	import { page } from '$app/stores';
	/**
	 * @type {any[]}
	 */
	let bookings = $page.data.bookings;
	let validBooking = false;
	let dateError = false;
	let bookingClash = false;
	/**
	 * @type {any}
	 */
	let arrive;
	/**
	 * @type {any}
	 */
	let depart;
	/**
	 * @param {{ arrive: any; depart: any; }} booking
	 */
	function isOverlap(booking) {
		let x1 = booking.arrive;
		let x2 = booking.depart;
		let y1 = arrive;
		let y2 = depart;
		return (x2 >= y1 && x2 <= y2) || (x1 >= y1 && x1 <= y2);
	}
	/**
	 * @param {{ arrive: any; depart: any; }} booking
	 */
	function isContains(booking) {
		let x1 = booking.arrive;
		let x2 = booking.depart;
		let y1 = arrive;
		let y2 = depart;
		return (x1 >= y1 && x2 <= y2) || (x1 <= y1 && x2 >= y2);
	}
	function validateBookings() {
		bookings.sort((a, b) => {
			const nA = a.arrive.replace(/\D/g, '');
			const nB = b.arrive.replace(/\D/g, '');
			const result = Number.parseInt(nA) - Number.parseInt(nB);
			return result;
		});
		validBooking = true;
		dateError = false;
		bookingClash = false;
		if (arrive > depart) {
			validBooking = false;
			dateError = true;
		}
		bookings = bookings.map((booking) => {
			const overlap = isContains(booking) || isOverlap(booking);
			if (overlap) {
				validBooking = false;
				bookingClash = true;
			}
			return { ...booking, overlap };
		});
	}
</script>

<section>
	<h1>Transkei-er</h1>
	<p>
		<em>Kom kuier by ons in die Transkei!</em><br />
		<span>Come visit us in the Transkei!</span>
	</p>

	<form method="post">
		<div>
			<label>
				Who are you? <br />
				<input type="text" name="name" required />
			</label>
		</div>
		<br />
		<div>
			<label>
				Arrival <br />
				<input
					class={dateError ? 'error' : ''}
					bind:value={arrive}
					on:change={validateBookings}
					type="date"
					name="arrive"
					required
				/>
			</label>
		</div>
		<br />
		<div>
			<label>
				Departure <br />
				<input
					class={dateError ? 'error' : ''}
					bind:value={depart}
					on:change={validateBookings}
					type="date"
					name="depart"
					required
				/>
			</label>
		</div>
		<br />
		<button type="submit" disabled={!validBooking}>Submit</button>
	</form>
	{#if $page.form?.success === false}
		<div class="error">Looks like your date might be clashing with another...</div>
	{/if}
	{#if bookingClash}
		<div class="error">Looks like you have a clash...</div>
	{/if}
	{#if dateError}
		<div class="error">Check your dates...</div>
	{/if}
	<br />
	<h2>Already booked dates:</h2>
	<table>
		{#each bookings as booking}
			<tr>
				<td class="right">{booking.name}: </td>
				<td class={`left ${booking.overlap ? 'error' : ''}`}>
					{booking.arrive} <br />
					~ {booking.depart}</td
				>
			</tr>
		{/each}
	</table>
</section>

<style>
	section {
		margin: auto;
		text-align: center;
		font-family: cursive;
		/* background-image: url('https://bulungula.co.za/wp-content/uploads/2021/10/hut--scaled.jpg'); */
	}
	table {
		margin: auto;
		border-spacing: 10px;
	}
	.left {
		text-align: left;
	}
	.right {
		text-align: right;
	}
	.error {
		color: red;
		font-weight: bold;
	}
</style>
