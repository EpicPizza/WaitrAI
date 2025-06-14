// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserRecord } from "firebase-admin/auth";
import type { Main } from "$lib/Firebase/firebase.svelte";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Main | undefined;
			getUser: () => Promise<boolean>,
      		rawUser: UserRecord | undefined;
			valid: boolean,
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
