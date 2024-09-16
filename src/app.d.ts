import type { ProfileBase, ProfileRoles, Subscription, FreeAccess } from '$lib/types/collection';
import type { Database } from '$lib/types/supabase';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	interface PageData {
		supabaseClient: SupabaseClient<Database>;
		session: Session | null;
		user: User | null;
		profile: Promise<ProfileBase | null>;
		roles: Promise<ProfileRoles | null>;
	}
	// interface Error {}
	// interface Platform {}
}
