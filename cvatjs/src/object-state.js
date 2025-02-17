/*
* Copyright (C) 2018 Intel Corporation
* SPDX-License-Identifier: MIT
*/

/* global
    require:false
*/

(() => {
    const PluginRegistry = require('./plugins');

    /**
        * Class representing a state of an object on a specific frame
        * @memberof module:API.cvat.classes
    */
    class ObjectState {
        /**
            * @param {Object} serialized - is an dictionary which contains
            * initial information about an ObjectState;
            * Necessary fields: type, shape
            * Necessary fields for objects which haven't been added to collection yet: frame
            * Optional fields: points, group, zOrder, outside, occluded,
            * attributes, lock, label, mode, color, keyframe
            * These fields can be set later via setters
        */
        constructor(serialized) {
            const data = {
                label: null,
                attributes: {},

                points: null,
                outside: null,
                occluded: null,
                keyframe: null,

                group: null,
                zOrder: null,
                lock: null,
                color: null,

                frame: serialized.frame,
                type: serialized.type,
                shape: serialized.shape,
                updateFlags: {},
            };

            // Shows whether any properties updated since last reset() or interpolation
            Object.defineProperty(data.updateFlags, 'reset', {
                value: function reset() {
                    this.label = false;
                    this.attributes = false;

                    this.points = false;
                    this.outside = false;
                    this.occluded = false;
                    this.keyframe = false;

                    this.group = false;
                    this.zOrder = false;
                    this.lock = false;
                    this.color = false;
                },
                writable: false,
            });

            Object.defineProperties(this, Object.freeze({
                // Internal property. We don't need document it.
                updateFlags: {
                    get: () => data.updateFlags,
                },
                frame: {
                    /**
                        * @name frame
                        * @type {integer}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @readonly
                        * @instance
                    */
                    get: () => data.frame,
                },
                type: {
                    /**
                        * @name type
                        * @type {module:API.cvat.enums.ObjectType}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @readonly
                        * @instance
                    */
                    get: () => data.type,
                },
                shape: {
                    /**
                        * @name shape
                        * @type {module:API.cvat.enums.ObjectShape}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @readonly
                        * @instance
                    */
                    get: () => data.shape,
                },
                label: {
                    /**
                        * @name shape
                        * @type {module:API.cvat.classes.Label}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.label,
                    set: (labelInstance) => {
                        data.updateFlags.label = true;
                        data.label = labelInstance;
                    },
                },
                color: {
                    /**
                        * @name color
                        * @type {string}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.color,
                    set: (color) => {
                        data.updateFlags.color = true;
                        data.color = color;
                    },
                },
                points: {
                    /**
                        * @name points
                        * @type {number[]}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.points,
                    set: (points) => {
                        data.updateFlags.points = true;
                        data.points = [...points];
                    },
                },
                group: {
                    /**
                        * @name group
                        * @type {integer}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.group,
                    set: (group) => {
                        data.updateFlags.group = true;
                        data.group = group;
                    },
                },
                zOrder: {
                    /**
                        * @name zOrder
                        * @type {integer}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.zOrder,
                    set: (zOrder) => {
                        data.updateFlags.zOrder = true;
                        data.zOrder = zOrder;
                    },
                },
                outside: {
                    /**
                        * @name outside
                        * @type {boolean}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.outside,
                    set: (outside) => {
                        data.updateFlags.outside = true;
                        data.outside = outside;
                    },
                },
                keyframe: {
                    /**
                        * @name keyframe
                        * @type {boolean}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.keyframe,
                    set: (keyframe) => {
                        data.updateFlags.keyframe = true;
                        data.keyframe = keyframe;
                    },
                },
                occluded: {
                    /**
                        * @name occluded
                        * @type {boolean}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.occluded,
                    set: (occluded) => {
                        data.updateFlags.occluded = true;
                        data.occluded = occluded;
                    },
                },
                lock: {
                    /**
                        * @name lock
                        * @type {boolean}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @instance
                    */
                    get: () => data.lock,
                    set: (lock) => {
                        data.updateFlags.lock = true;
                        data.lock = lock;
                    },
                },
                attributes: {
                    /**
                        * Object is id:value pairs where "id" is an integer
                        * attribute identifier and "value" is an attribute value
                        * @name attributes
                        * @type {Object}
                        * @memberof module:API.cvat.classes.ObjectState
                        * @throws {module:API.cvat.exceptions.ArgumentError}
                        * @instance
                    */
                    get: () => data.attributes,
                    set: (attributes) => {
                        if (typeof (attributes) !== 'object') {
                            if (typeof (attributes) === 'undefined') {
                                throw new window.cvat.exceptions.ArgumentError(
                                    'Expected attributes are object, but got undefined',
                                );
                            }

                            throw new window.cvat.exceptions.ArgumentError(
                                `Expected attributes are object, but got ${attributes.constructor.name}`,
                            );
                        }

                        for (const attrID of Object.keys(attributes)) {
                            data.updateFlags.attributes = true;
                            data.attributes[attrID] = attributes[attrID];
                        }
                    },
                },
            }));

            this.label = serialized.label;
            this.group = serialized.group;
            this.zOrder = serialized.zOrder;
            this.outside = serialized.outside;
            this.keyframe = serialized.keyframe;
            this.occluded = serialized.occluded;
            this.attributes = serialized.attributes;
            this.points = serialized.points;
            this.color = serialized.color;
            this.lock = serialized.lock;

            data.updateFlags.reset();
        }

        /**
            * Method saves/updates an object state in a collection
            * @method save
            * @memberof module:API.cvat.classes.ObjectState
            * @readonly
            * @instance
            * @async
            * @throws {module:API.cvat.exceptions.PluginError}
            * @throws {module:API.cvat.exceptions.ArgumentError}
            * @returns {module:API.cvat.classes.ObjectState} updated state of an object
        */
        async save() {
            const result = await PluginRegistry
                .apiWrapper.call(this, ObjectState.prototype.save);
            return result;
        }

        /**
            * Method deletes an object from a collection
            * @method delete
            * @memberof module:API.cvat.classes.ObjectState
            * @readonly
            * @instance
            * @param {boolean} [force=false] delete object even if it is locked
            * @async
            * @returns {boolean} wheter object was deleted
            * @throws {module:API.cvat.exceptions.PluginError}
        */
        async delete(force = false) {
            const result = await PluginRegistry
                .apiWrapper.call(this, ObjectState.prototype.delete, force);
            return result;
        }
    }

    // Default implementation saves element in collection
    ObjectState.prototype.save.implementation = async function () {
        if (this.updateInCollection) {
            return this.updateInCollection();
        }

        return this;
    };

    // Default implementation do nothing
    ObjectState.prototype.delete.implementation = async function (force) {
        if (this.deleteFromCollection) {
            return this.deleteFromCollection(force);
        }

        return false;
    };


    module.exports = ObjectState;
})();
