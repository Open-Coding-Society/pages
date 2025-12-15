import { Vec2, Vec3 } from '../essentials/Vectors.js';
import { Transform } from '../Transform.js';
import { ballCollide } from '../../adventureGame/GameEngine/Collision.js';
import { camera } from '../Camera.js';

export const deltaTime = 0.1;

export class RigidBody {
    constructor(object, mass, fixed=false) {
        this.rb = object;
        this.mass = mass;
        this.relativeMass = this.mass;
        this.fixed = fixed;

        this.dilatedTime = 0.1;

        this.acceleration = new Vec2(0);
        this.netForce = new Vec2(0);

        this.G = 6.676 * Math.pow(10, -11);
        this.c = 299792458;

        this.staticFriction = 0.75;
        this.kineticFriction = 0.6;

        this.weight = 9.81 * this.mass;

        this.collision = new Collider();
    }

    LinearForce(force, dir) {
        const rads = (dir * Math.PI) / 180;
        this.acceleration.x = (force / this.mass) * Math.sin(rads);
        this.acceleration.y = (force / this.mass) * Math.cos(rads);
    }

    applyImpulse(J) {
        this.velocity.add(J.div(this.relativeMass));
    }


    LinearImpulse(rv, normal, sum, body) {
        const velAlongNormal = rv.dot(normal);

        if (velAlongNormal > 0) return false;

        const e = 0.5;

        const j = -(1 + e) * velAlongNormal;
        const MassSum = sum;

        if (MassSum === 0) return false;

        const impulseScalar = j * MassSum;
        const impulse = normal.mult(impulseScalar);

        this.applyImpulse(impulse.mult(new Vec2(-1)));
        body.applyImpulse(impulse);

        return true;
    }

    applFriction(rv, body) {
        const jt = -rv.dot(tangent);
        const jtScalar = jt / invMassSum;

        const mu = Math.sqrt(this.kineticFriction * body.kineticFriction);

        let frictionImpulse;
        if (Math.abs(jtScalar) < impulseScalar * mu) {
        frictionImpulse = tangent.mul(jtScalar);
        } else {
        frictionImpulse = tangent.mul(-impulseScalar * mu);
        }
    }

    Collide(body) {
        if (this.collision.ballCollide(this.rb, body.rb)) {
            const rv = body.rb.velocity.sub(this.rb.velocity);
            const normal = rv.normalized();
            const MassSum = this.relativeMass + body.relativeMass;
            const impulse = this.LinearImpulse(rv, normal, MassSum, body);
            if (impulse) {
                const penetration = this.rb.position.sub(body.rb.position).length() - (this.rb.size.add(body.rb.size));
                const percent = 0.8;
                const slop = 0.01;
                const correction = normal.mult(new Vec2(Math.max(penetration - slop, 0) / MassSum * percent));

                this.rb.position.sub(correction.div(this.relativeMass));
                body.rb.position.add(correction.div(body.relativeMass));
            }
        }
    }

    Update() {
        const time = new Vec2(deltaTime);
        this.position = this.position.add(this.velocity.mult(time));
    }

};