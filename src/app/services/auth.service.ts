import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@angular/fire/auth';
import { signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc,getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(this.firestore, `users/${user.uid}`), {
      uid: user.uid,
      email: user.email,
      role: 'user' // 👈 por defecto
    });

    return userCredential;
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async getUserRole(uid: string) {
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);

    return snap.exists() ? snap.data()['role'] : null;
  }
}