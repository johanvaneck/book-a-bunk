<script>
	import { page } from '$app/stores';
	/**
	 * @type {any[]}
	 */
	let bookings = $page.data.bookings;
	let validBooking = false;
	let dateError = false;
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
		validBooking = true;
		dateError = false;
		if (arrive > depart) {
			validBooking = false;
			dateError = true;
			return;
		}
		bookings = bookings.map((booking) => {
			const overlap = isContains(booking) || isOverlap(booking);
			if (overlap) {
				validBooking = false;
			}
			return { ...booking, overlap };
		});
	}
</script>

<section>
	<h1>Transkei-er</h1>
	<p>
		<span>Kom kuier by ons in die Transkei!</span> <br />
		<em>Come visit us in the Transkei!</em>
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
	<br />
	<h2>Already booked dates:</h2>
	{#each bookings as booking}
		<div class={`right ${booking.overlap ? 'error' : ''}`}>
			{booking.name}: {booking.arrive} ~ {booking.depart}
		</div>
	{/each}
</section>

<style>
	.right {
		text-justify: right;
	}
	.error {
		color: red;
		font-weight: bold;
	}
</style>
