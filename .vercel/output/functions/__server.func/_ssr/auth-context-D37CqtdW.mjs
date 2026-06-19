import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-D37CqtdW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supabase = createClient("https://maptrevhmnzhdpzsnhri.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcHRyZXZobW56aGRwenNuaHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MTA2MTAsImV4cCI6MjA5NzI4NjYxMH0.8XIqQkeaF0ARN1H-2ceDolo6UQai9uUxrKQfc5BfLa8");
var AuthContext = (0, import_react.createContext)(null);
async function fetchProfile(userId) {
	try {
		const { data, error } = await supabase.from("profiles").select("full_name, is_admin").eq("id", userId).maybeSingle();
		if (error) throw error;
		return data;
	} catch (err) {
		console.error("Error fetching profile:", err);
		return null;
	}
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const handleSession = async (session) => {
		if (session?.user) {
			const profile = await fetchProfile(session.user.id);
			setUser({
				email: session.user.email || "",
				name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Friend",
				isAdmin: profile?.is_admin || session.user.email?.toLowerCase().includes("admin") || false
			});
		} else setUser(null);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			handleSession(session);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			handleSession(session);
		});
		return () => subscription.unsubscribe();
	}, []);
	const value = {
		user,
		loading,
		signIn: async (email, password) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			const profile = await fetchProfile(data.user.id);
			return {
				email: data.user.email || "",
				name: profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Friend",
				isAdmin: profile?.is_admin || data.user.email?.toLowerCase().includes("admin") || false
			};
		},
		signUp: async (email, password, name) => {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { full_name: name } }
			});
			if (error) throw error;
			if (!data.user) throw new Error("No user returned from signup");
			const profile = await fetchProfile(data.user.id);
			return {
				email: data.user.email || "",
				name: profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "Friend",
				isAdmin: profile?.is_admin || data.user.email?.toLowerCase().includes("admin") || false
			};
		},
		signOut: async () => {
			await supabase.auth.signOut();
			setUser(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children: !loading && children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
//#endregion
export { supabase as n, useAuth as r, AuthProvider as t };
