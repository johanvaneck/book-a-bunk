import { supabaseClient } from '$lib/db';
import { fail } from '@sveltejs/kit';

/**
 * @type {any[]}
 */
let globalBookings = [];

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { request } = event;
		const formData = await request.formData();

		const name = formData.get('name')?.toString();
		const arrive = formData.get('arrive')?.toString();
		const depart = formData.get('depart')?.toString();

		if (arrive && depart && !isValidBooking(arrive, depart, globalBookings)) {
			return fail(400, { success: false, message: 'Invalid booking date.' });
		}

		const { error: writeError } = await supabaseClient
			.from('bookings')
			.insert({ name, arrive, depart });

		if (writeError) {
			return fail(500, {
				success: false,
				message: 'Something went wrong with writing data to the database.'
			});
		}
		return { success: true };
	}
};
/** @type {import('./$types').PageServerLoad} */
export async function load() {
	let { data: bookings, error } = await supabaseClient.from('bookings').select('*');
	if (error || !bookings) {
		return fail(500, { message: 'Something went wrong with the database.' });
	} else {
		bookings?.sort((a, b) => {
			const nA = a.arrive.replace(/\D/g, '');
			const nB = b.arrive.replace(/\D/g, '');
			const result = Number.parseInt(nA) - Number.parseInt(nB);
			return result;
		});
		globalBookings = bookings;
		return { bookings };
	}
}
/**
 * @param {{arrive: any;depart: any;}} booking
 * @param {string} arrive
 * @param {string} depart
 */
function isOverlap(arrive, depart, booking) {
	let x1 = booking.arrive;
	let x2 = booking.depart;
	let y1 = arrive;
	let y2 = depart;
	return (x2 >= y1 && x2 <= y2) || (x1 >= y1 && x1 <= y2);
}
/**
 * @param {{arrive: any;depart: any;}} booking
 * @param {string} arrive
 * @param {string} depart
 */
function isContains(arrive, depart, booking) {
	let x1 = booking.arrive;
	let x2 = booking.depart;
	let y1 = arrive;
	let y2 = depart;
	return (x1 >= y1 && x2 <= y2) || (x1 <= y1 && x2 >= y2);
}
/**
 * @param {string} arrive
 * @param {string} depart
 * @param {any[]} bookings
 */
function isValidBooking(arrive, depart, bookings) {
	bookings.forEach((booking) => {
		const overlap = isContains(arrive, depart, booking) || isOverlap(arrive, depart, booking);
		if (overlap) {
			return false;
		}
	});
	return true;
}
